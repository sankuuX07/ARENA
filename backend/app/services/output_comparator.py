class OutputComparator:
    @staticmethod
    def compare(actual: str, expected: str) -> bool:
        """
        Deterministically compares output by:
        - Normalizing line endings (\r\n -> \n)
        - Trimming insignificant trailing/leading whitespace per line
        - Ignoring trailing empty lines
        """
        def normalize(text: str) -> list[str]:
            if not text:
                return []
            lines = text.replace('\r\n', '\n').split('\n')
            # Strip whitespace from each line
            lines = [line.strip() for line in lines]
            # Remove trailing empty lines
            while lines and not lines[-1]:
                lines.pop()
            return lines

        norm_actual = normalize(actual)
        norm_expected = normalize(expected)
        
        return norm_actual == norm_expected

output_comparator = OutputComparator()
